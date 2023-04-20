class ShareData {
    id: string;

    constructor(
        public name: string,
        public LTP: number,
        public pointChange: number,
        public percentageChange: number,
        public open: number,
        public high: number,
        public low: number,
        public volume: number,
        public prevClose: number,
    ){
        this.id = Math.random().toString() + new Date().toISOString();
    }
}

export default ShareData;