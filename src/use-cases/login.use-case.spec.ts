import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import * as bcryptjs from 'bcryptjs';
import * as honoJwt from 'hono/jwt';
import { LoginUseCase } from './login.use-case';
import * as dbModule from '../../drizzle/db';

// Mock dos módulos
vi.mock('../../drizzle/db', () => ({
  getDb: vi.fn(),
}));

vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
}));

vi.mock('hono/jwt', () => ({
  sign: vi.fn(),
}));

describe('LoginUseCase', () => {
  let mockD1Database: D1Database;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDb: any;

  beforeEach(() => {
    // Reset dos mocks antes de cada teste
    vi.clearAllMocks();

    // Mock do D1Database
    mockD1Database = {} as D1Database;

    // Mock do objeto db com os métodos necessários
    mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      get: vi.fn(),
    };

    // Configurar o mock do getDb para retornar nosso mockDb
    vi.mocked(dbModule.getDb).mockReturnValue(mockDb);
  });

  it('deve retornar sucesso com token quando credenciais são válidas', async () => {
    // Arrange
    const loginData = {
      email: 'usuario@teste.com',
      password: 'senha123',
    };
    const jwtSecret = 'secret-key';

    const mockUser = {
      id: 1,
      name: 'Usuário Teste',
      email: 'usuario@teste.com',
      password: '$2a$10$hashedPassword',
      zipCode: '12345-678',
      address: 'Rua Teste',
      number: '123',
      city: 'São Paulo',
      state: 'SP',
      phone: '11999999999',
      nameComplement: null,
      addressComplement: null,
      deletedAt: null,
    };

    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken';

    // Configurar mocks
    mockDb.get.mockResolvedValue(mockUser);
    vi.mocked(bcryptjs.compare).mockResolvedValue(true as never);
    vi.mocked(honoJwt.sign).mockResolvedValue(mockToken);

    // Act
    const result = await LoginUseCase.execute(mockD1Database, loginData, jwtSecret);

    // Assert
    expect(result.success).toBe(true);
    expect(result.user).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
    });
    expect(result.token).toBe(mockToken);
    expect(result.error).toBeUndefined();

    // Verificar se os mocks foram chamados corretamente
    expect(dbModule.getDb).toHaveBeenCalledWith(mockD1Database);
    expect(bcryptjs.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
    expect(honoJwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: mockUser.id,
        exp: expect.any(Number),
      }),
      jwtSecret,
    );
  });

  it('deve retornar erro 401 quando usuário não existe', async () => {
    // Arrange
    const loginData = {
      email: 'naoexiste@teste.com',
      password: 'senha123',
    };
    const jwtSecret = 'secret-key';

    // Configurar mock para retornar undefined (usuário não encontrado)
    mockDb.get.mockResolvedValue(undefined);

    // Act
    const result = await LoginUseCase.execute(mockD1Database, loginData, jwtSecret);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toEqual({
      message: 'Credenciais Inválidas',
      statusCode: 401,
    });
    expect(result.user).toBeUndefined();
    expect(result.token).toBeUndefined();

    // Verificar que o compare não foi chamado
    expect(bcryptjs.compare).not.toHaveBeenCalled();
    expect(honoJwt.sign).not.toHaveBeenCalled();
  });

  it('deve retornar erro 401 quando senha está incorreta', async () => {
    // Arrange
    const loginData = {
      email: 'usuario@teste.com',
      password: 'senhaErrada',
    };
    const jwtSecret = 'secret-key';

    const mockUser = {
      id: 1,
      name: 'Usuário Teste',
      email: 'usuario@teste.com',
      password: '$2a$10$hashedPassword',
      zipCode: '12345-678',
      address: 'Rua Teste',
      number: '123',
      city: 'São Paulo',
      state: 'SP',
      phone: '11999999999',
      nameComplement: null,
      addressComplement: null,
      deletedAt: null,
    };

    // Configurar mocks
    mockDb.get.mockResolvedValue(mockUser);
    vi.mocked(bcryptjs.compare).mockResolvedValue(false as never);

    // Act
    const result = await LoginUseCase.execute(mockD1Database, loginData, jwtSecret);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toEqual({
      message: 'Credenciais Inválidas',
      statusCode: 401,
    });
    expect(result.user).toBeUndefined();
    expect(result.token).toBeUndefined();

    // Verificar que o sign não foi chamado
    expect(bcryptjs.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
    expect(honoJwt.sign).not.toHaveBeenCalled();
  });

  it('deve retornar erro 401 quando usuário foi deletado', async () => {
    // Arrange
    const loginData = {
      email: 'deletado@teste.com',
      password: 'senha123',
    };
    const jwtSecret = 'secret-key';

    // O filtro isNull(entity.deletedAt) deve impedir o retorno
    // então o mock retorna undefined
    mockDb.get.mockResolvedValue(undefined);

    // Act
    const result = await LoginUseCase.execute(mockD1Database, loginData, jwtSecret);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toEqual({
      message: 'Credenciais Inválidas',
      statusCode: 401,
    });
    expect(result.user).toBeUndefined();
    expect(result.token).toBeUndefined();
  });

  it('deve retornar erro 400 quando ocorre exceção no banco de dados', async () => {
    // Arrange
    const loginData = {
      email: 'usuario@teste.com',
      password: 'senha123',
    };
    const jwtSecret = 'secret-key';
    const mockError = new Error('Erro de conexão com banco de dados');

    // Configurar mock para lançar erro
    mockDb.get.mockRejectedValue(mockError);

    // Act
    const result = await LoginUseCase.execute(mockD1Database, loginData, jwtSecret);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toEqual({
      message: `Erro interno do servidor: ${mockError}`,
      statusCode: 400,
    });
    expect(result.user).toBeUndefined();
    expect(result.token).toBeUndefined();
  });

  it('deve retornar erro 400 quando bcrypt.compare lança exceção', async () => {
    // Arrange
    const loginData = {
      email: 'usuario@teste.com',
      password: 'senha123',
    };
    const jwtSecret = 'secret-key';

    const mockUser = {
      id: 1,
      name: 'Usuário Teste',
      email: 'usuario@teste.com',
      password: '$2a$10$hashedPassword',
      zipCode: '12345-678',
      address: 'Rua Teste',
      number: '123',
      city: 'São Paulo',
      state: 'SP',
      phone: '11999999999',
      nameComplement: null,
      addressComplement: null,
      deletedAt: null,
    };

    const mockError = new Error('Erro no bcrypt');

    // Configurar mocks
    mockDb.get.mockResolvedValue(mockUser);
    vi.mocked(bcryptjs.compare).mockRejectedValue(mockError);

    // Act
    const result = await LoginUseCase.execute(mockD1Database, loginData, jwtSecret);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toEqual({
      message: `Erro interno do servidor: ${mockError}`,
      statusCode: 400,
    });
    expect(result.user).toBeUndefined();
    expect(result.token).toBeUndefined();
  });

  it('deve retornar erro 400 quando JWT sign lança exceção', async () => {
    // Arrange
    const loginData = {
      email: 'usuario@teste.com',
      password: 'senha123',
    };
    const jwtSecret = 'secret-key';

    const mockUser = {
      id: 1,
      name: 'Usuário Teste',
      email: 'usuario@teste.com',
      password: '$2a$10$hashedPassword',
      zipCode: '12345-678',
      address: 'Rua Teste',
      number: '123',
      city: 'São Paulo',
      state: 'SP',
      phone: '11999999999',
      nameComplement: null,
      addressComplement: null,
      deletedAt: null,
    };

    const mockError = new Error('Erro ao gerar token');

    // Configurar mocks
    mockDb.get.mockResolvedValue(mockUser);
    vi.mocked(bcryptjs.compare).mockResolvedValue(true as never);
    vi.mocked(honoJwt.sign).mockRejectedValue(mockError);

    // Act
    const result = await LoginUseCase.execute(mockD1Database, loginData, jwtSecret);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toEqual({
      message: `Erro interno do servidor: ${mockError}`,
      statusCode: 400,
    });
    expect(result.user).toBeUndefined();
    expect(result.token).toBeUndefined();
  });

  it('deve gerar token com expiração de 24 horas', async () => {
    // Arrange
    const loginData = {
      email: 'usuario@teste.com',
      password: 'senha123',
    };
    const jwtSecret = 'secret-key';

    const mockUser = {
      id: 1,
      name: 'Usuário Teste',
      email: 'usuario@teste.com',
      password: '$2a$10$hashedPassword',
      zipCode: '12345-678',
      address: 'Rua Teste',
      number: '123',
      city: 'São Paulo',
      state: 'SP',
      phone: '11999999999',
      nameComplement: null,
      addressComplement: null,
      deletedAt: null,
    };

    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken';
    const currentTime = Math.floor(Date.now() / 1000);
    const expectedExpiration = currentTime + 60 * 60 * 24; // 24 horas

    // Configurar mocks
    mockDb.get.mockResolvedValue(mockUser);
    vi.mocked(bcryptjs.compare).mockResolvedValue(true as never);
    vi.mocked(honoJwt.sign).mockResolvedValue(mockToken);

    // Act
    await LoginUseCase.execute(mockD1Database, loginData, jwtSecret);

    // Assert
    expect(honoJwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: mockUser.id,
        exp: expect.any(Number),
      }),
      jwtSecret,
    );

    // Verificar que a expiração está próxima de 24 horas (com margem de 1 segundo)
    const signCall = vi.mocked(honoJwt.sign).mock.calls[0];
    const payload = signCall[0] as { sub: number; exp: number };
    expect(payload.exp).toBeGreaterThanOrEqual(expectedExpiration - 1);
    expect(payload.exp).toBeLessThanOrEqual(expectedExpiration + 1);
  });

  it('deve retornar apenas dados não sensíveis do usuário', async () => {
    // Arrange
    const loginData = {
      email: 'usuario@teste.com',
      password: 'senha123',
    };
    const jwtSecret = 'secret-key';

    const mockUser = {
      id: 1,
      name: 'Usuário Teste',
      email: 'usuario@teste.com',
      password: '$2a$10$hashedPassword',
      zipCode: '12345-678',
      address: 'Rua Teste',
      number: '123',
      city: 'São Paulo',
      state: 'SP',
      phone: '11999999999',
      nameComplement: 'Complemento',
      addressComplement: 'Apto 101',
      deletedAt: null,
    };

    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken';

    // Configurar mocks
    mockDb.get.mockResolvedValue(mockUser);
    vi.mocked(bcryptjs.compare).mockResolvedValue(true as never);
    vi.mocked(honoJwt.sign).mockResolvedValue(mockToken);

    // Act
    const result = await LoginUseCase.execute(mockD1Database, loginData, jwtSecret);

    // Assert
    expect(result.success).toBe(true);
    expect(result.user).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
    });
    // Verificar que dados sensíveis não estão no retorno
    expect(result.user).not.toHaveProperty('password');
    expect(result.user).not.toHaveProperty('zipCode');
    expect(result.user).not.toHaveProperty('address');
    expect(result.user).not.toHaveProperty('phone');
  });
});
