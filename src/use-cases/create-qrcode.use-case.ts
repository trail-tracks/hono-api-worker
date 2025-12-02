import { eq } from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { pointOfInterest, trail } from '../../drizzle/schema';
import * as qr from 'qr-image-color';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface CreateQRCodeUseCaseInput {
  d1Database: D1Database;
  trailId: number;
  entityId: number;
}

export interface CreateQRCodeUseCaseResponse {
  success: boolean;
  pdf?: Uint8Array;
  error?: {
    message: string;
    statusCode: number;
  };
}

interface QRCodeItem {
  type: 'trail' | 'poi';
  id: number;
  name: string;
}

export class CreateQRCodeUseCase {
  static async execute(
    params: CreateQRCodeUseCaseInput,
  ): Promise<CreateQRCodeUseCaseResponse> {
    const { d1Database, trailId, entityId } = params;

    const db = getDb(d1Database);

    try {
      // Verificar se a trilha existe e pertence à entidade
      const trailData = await db
        .select({
          id: trail.id,
          name: trail.name,
          entityId: trail.entityId,
        })
        .from(trail)
        .where(eq(trail.id, trailId))
        .get();

      if (!trailData) {
        return {
          success: false,
          error: {
            message: 'Trilha não encontrada',
            statusCode: 404,
          },
        };
      }

      if (trailData.entityId !== entityId) {
        return {
          success: false,
          error: {
            message: 'Você não tem permissão para gerar QR codes desta trilha',
            statusCode: 403,
          },
        };
      }

      // Buscar todos os pontos de interesse da trilha
      const pointsOfInterest = await db
        .select({
          id: pointOfInterest.id,
          name: pointOfInterest.name,
        })
        .from(pointOfInterest)
        .where(eq(pointOfInterest.trailId, trailId))
        .all();

      // Montar lista de itens para QR codes
      const items: QRCodeItem[] = [
        {
          type: 'trail',
          id: trailData.id,
          name: trailData.name,
        },
        ...pointsOfInterest.map((poi) => ({
          type: 'poi' as const,
          id: poi.id,
          name: poi.name,
        })),
      ];

      // Gerar PDF
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

      const margin = 40;
      const columnGap = 40;
      const qrSize = 150;
      const titleFontSize = 12;
      const typeFontSize = 9;
      const itemsPerPage = 6;
      const itemsPerRow = 2;

      let currentPage = pdf.addPage([595, 842]); // A4
      let pageHeight = currentPage.getHeight();
      let pageWidth = currentPage.getWidth();

      const columnWidth = (pageWidth - margin * 2 - columnGap) / 2;
      const rowHeight = (pageHeight - margin * 2) / 3;

      for (let i = 0; i < items.length; i++) {
        // Adicionar nova página se necessário
        if (i > 0 && i % itemsPerPage === 0) {
          currentPage = pdf.addPage([595, 842]);
          pageHeight = currentPage.getHeight();
          pageWidth = currentPage.getWidth();
        }

        const positionInPage = i % itemsPerPage;
        const row = Math.floor(positionInPage / itemsPerRow);
        const col = positionInPage % itemsPerRow;

        const x = margin + col * (columnWidth + columnGap);
        const y = pageHeight - margin - row * rowHeight;

        const item = items[i];

        // Gerar QR Code como buffer PNG usando qr-image-color (compatível com Workers)
        const qrData = JSON.stringify({
          type: item.type,
          id: item.id,
        });

        const qrPng = qr.image(qrData, { 
          type: 'png',
          ec_level: 'H',
          size: 10,
          margin: 2,
        });

        // Converter stream para buffer
        const chunks: Buffer[] = [];
        for await (const chunk of qrPng) {
          if (Buffer.isBuffer(chunk)) {
            chunks.push(chunk);
          }
        }
        const qrBuffer = Buffer.concat(chunks);

        const qrImage = await pdf.embedPng(qrBuffer);

        // Desenhar tipo (Trail/POI) - centralizado
        const typeText = item.type === 'trail' ? 'TRILHA' : 'PONTO DE INTERESSE';
        const typeWidth = font.widthOfTextAtSize(typeText, typeFontSize);
        currentPage.drawText(typeText, {
          x: x + (columnWidth - typeWidth) / 2,
          y: y - 15,
          size: typeFontSize,
          font: font,
          color: rgb(0.4, 0.4, 0.4),
        });

        // Desenhar nome - centralizado
        const maxNameWidth = columnWidth - 10;
        let displayName = item.name;
        let nameWidth = fontBold.widthOfTextAtSize(displayName, titleFontSize);

        // Truncar nome se muito longo
        if (nameWidth > maxNameWidth) {
          while (nameWidth > maxNameWidth && displayName.length > 3) {
            displayName = displayName.slice(0, -1);
            nameWidth = fontBold.widthOfTextAtSize(displayName + '...', titleFontSize);
          }
          displayName += '...';
          nameWidth = fontBold.widthOfTextAtSize(displayName, titleFontSize);
        }

        currentPage.drawText(displayName, {
          x: x + (columnWidth - nameWidth) / 2,
          y: y - 30,
          size: titleFontSize,
          font: fontBold,
          color: rgb(0, 0, 0),
        });

        // Desenhar QR Code - centralizado
        currentPage.drawImage(qrImage, {
          x: x + (columnWidth - qrSize) / 2,
          y: y - qrSize - 50,
          width: qrSize,
          height: qrSize,
        });
      }

      const pdfBytes = await pdf.save();

      return {
        success: true,
        pdf: pdfBytes,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('CreateQRCodeUseCase error:', error);

      return {
        success: false,
        error: {
          message: 'Não foi possível gerar os QR codes',
          statusCode: 500,
        },
      };
    }
  }
}
