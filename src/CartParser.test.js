import CartParser from './CartParser';

let parser;
let validate;
let parseLine;
let calcTotal;
let createError;

beforeEach(() => {
	parser = new CartParser();
	validate = parser.validate.bind(parser);
	parseLine = parser.parseLine.bind(parser);
	calcTotal = parser.calcTotal;
	createError = parser.createError.bind(parser);
});

describe('CartParser - unit tests', () => {
	// Add your unit tests here.
	const line = 'Consectetur adipiscing,28.72,10';
	const allItems = 'Product name,Price,Quantity\nMollis consequat,9.00,2\nTvoluptatem,10.32,1\nScelerisque lacinia,18.90,1\nConsectetur adipiscing,28.72,10\nCondimentum aliquet,13.90,1';
	const allItemsErrorInHeader = 'Product name,Plice,Quantity\nMollis consequat,9.00,2\nTvoluptatem,10.32,1\nScelerisque lacinia,18.90,1\nConsectetur adipiscing,28.72,10\nCondimentum aliquet,13.90,1';
	const allItemsErrorInCellsLength = 'Product name,Price,Quantity\nMollis consequat,9.00,2\nTvoluptatem,1\nScelerisque lacinia,18.90,1\nConsectetur adipiscing,28.72,10\nCondimentum aliquet,13.90,1';
	const allItemsEmptyCell = 'Product name,Price,Quantity\nMollis consequat,9.00,2\nTvoluptatem,10.32,1\n,18.90,1\nConsectetur adipiscing,28.72,10\nCondimentum aliquet,13.90,1';
	const allItemsNegativeCell = 'Product name,Price,Quantity\nMollis consequat,9.00,2\nTvoluptatem,10.32,1\nScelerisque lacinia,18.90,-3\nConsectetur adipiscing,28.72,10\nCondimentum aliquet,13.90,1';
	it('should return product name', () => {
		expect(parseLine(line).name).toEqual('Consectetur adipiscing');
	});
	it('should return product price', () => {
		expect(parseLine(line).price).toEqual(28.72);
	});
	it('should return product quantity', () => {
		expect(parseLine(line).quantity).toEqual(10);
	});
	it('should return empty error array', () => {
		expect(validate(allItems)).toEqual([]);
	});
	it('should return error in header name', () => {
		expect(validate(allItemsErrorInHeader)[0]).toEqual(createError(parser.ErrorType.HEADER,
			0,
			1,
			'Expected header to be named "Price" but received Plice.'));
	});
	it('should return error in cells lenght', () => {
		expect(validate(allItemsErrorInCellsLength)[0]).toEqual(createError(parser.ErrorType.ROW,
			2,
			-1,
			'Expected row to have 3 cells but received 2.'));
	});
	it('should return error cell empty string', () => {
		expect(validate(allItemsEmptyCell)[0]).toEqual(createError(parser.ErrorType.CELL,
			3,
			0,
			'Expected cell to be a nonempty string but received "".'));
	});
	it('should return error cell to be positive number',()=>{
		expect(validate(allItemsNegativeCell)[0]).toEqual(createError(parser.ErrorType.CELL,
			3,
			2,
			'Expected cell to be a positive number but received "-3".'));
	});
	it('should return total price of all items', ()=>{
		const items = [
			{
				"id": "3e6def17-5e87-4f27-b6b8-ae78948523a9",
				"name": "Mollis consequat",
				"price": 9,
				"quantity": 2
			},
			{
				"id": "90cd22aa-8bcf-4510-a18d-ec14656d1f6a",
				"name": "Tvoluptatem",
				"price": 10.32,
				"quantity": 1
			},
			{
				"id": "33c14844-8cae-4acd-91ed-6209a6c0bc31",
				"name": "Scelerisque lacinia",
				"price": 18.9,
				"quantity": 1
			}
		]
		expect(calcTotal(items)).toEqual(47.22);
	});

});

describe('CartParser - integration test', () => {
	// Add your integration test here.
	const pathWithErrors = './samples/cartErr.csv';
	it('should return error validation failed',()=>{
		expect(()=>{parser.parse(pathWithErrors)}).toThrow("Validation failed!");
	})
});