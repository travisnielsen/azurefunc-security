import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty({ type: String, description: 'This is the customer ID', minLength: 5 })
    readonly customer: string;

    @ApiProperty({ type: Number, description: 'The amount of the item in the order', minimum: 1, default: 1 })
    readonly quantity: number;

    @ApiProperty( { type: String, description: 'ID of the item being ordered', minLength: 5 } )
    readonly sku: string;
}