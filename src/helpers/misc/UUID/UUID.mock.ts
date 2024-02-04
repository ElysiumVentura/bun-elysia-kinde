export default class UUIDMock {
    private static counter = 0;

    public static generateUUID(): `${string}-${string}-${string}-${string}-${string}` {
        this.counter += 1;
        const val = `0-0-0-0-${this.counter}`;
        return val as `${string}-${string}-${string}-${string}-${string}`;
    }

    public static reset() {
        this.counter = 0;
    }
}
