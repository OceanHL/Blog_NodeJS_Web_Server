enum ErrorType {
    SUCCESS,
    FAIL = -1
}

class BaseModel<T = any> {
    constructor(
        protected readonly data?: T,
        protected readonly message?: string
    ) {}
}

export class SuccessModel<T = any> extends BaseModel {
    protected errno: ErrorType;
    constructor(
        data?: T,
        message?: string
    ) {
        super(data, message);
        this.errno = ErrorType.SUCCESS;
    }
}

export class ErrorModel extends BaseModel {
    protected errno: ErrorType;
    constructor(message: string, data?: any, ) {
        super(data, message);
        this.errno = ErrorType.FAIL;
    }
}