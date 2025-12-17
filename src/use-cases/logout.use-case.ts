export interface LogoutUseCaseResponse {
  success: boolean;
  message: string;
}

export class LogoutUseCase {
  static async execute(): Promise<LogoutUseCaseResponse> {
    // O logout é feito apenas removendo o cookie no controller
    // Este use case existe para manter a consistência da arquitetura
    return {
      success: true,
      message: 'Logout realizado com sucesso',
    };
  }
}
