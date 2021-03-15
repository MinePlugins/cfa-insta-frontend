import { Category } from "../category/category";

export class Product {
    public static fromJson(json: Object): Product {
        return new Product(
            json['id'],
            json['name'],
            json['category_id'],
            json['category'],
            json['price'],
            json['unit'],
            json['availability'],
            json['sale'],
            json['discount'],
            json['comments'],
            json['owner'],
            json['quantity_sales'],
            json['stock'],
            )
    }

    constructor(public id: number,
                public name: string,
                public category_id: number,
                public category: Category,
                public price: number,
                public unit: string,
                public availability: boolean,
                public sale: boolean,
                public discount: number,
                public comments: string,
                public owner: string,
                public quantity_sales: number,
                public stock: number,
                ) {
    }
}