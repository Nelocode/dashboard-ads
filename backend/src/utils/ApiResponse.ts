export class ApiResponse<T = any> {
  public success: boolean;
  public data?: T;
  public error?: string;
  public message?: string;

  constructor(success: boolean, data?: T, error?: string, message?: string) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.message = message;
  }

  static success<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse(true, data, undefined, message);
  }

  static error(error: string, message?: string): ApiResponse {
    return new ApiResponse(false, undefined, error, message);
  }
}
