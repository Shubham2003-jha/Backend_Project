class ApiResponse{
    constructor(status, message, data = null) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.success = status >= 200 && status < 300;

        // Capture stack trace if available
        
    }
}

export default ApiResponse;