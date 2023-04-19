export class Product {

    constructor(
        public id: number,
        public sku: string,
        public name: string,
        public description: string,
        public unitPrice: number,
        public imageUrl: string,
        public imageBackUrl: string,
        public imageTwoUrl: string,
        public imageThreeUrl: string,
        public active: boolean,
        public unitsInStock: number,
        public dateCreated: Date,
        public setName: string,
        public condition: string,
        public lastUpdated: Date,
    ) {}
}
