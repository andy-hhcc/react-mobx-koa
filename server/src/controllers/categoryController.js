import { generateCode } from '../utils';
import model from '../models';

const CATEGORY_CODE_LENGTH = 4;
const CATEGORY_PREFIX_CODE = 'CA';

export const getAllCategories = async (ctx, next) => {
	const categories = await model.Category.findAll();
  ctx.body = {
		success: true,
		result: categories,
	};
};

export const findCategoryByCode = async (ctx, next) => {
	const category = await model.Category.findOne({
		where: {
			code: ctx.params.code,
		},
	});

	ctx.body = {
		success: true,
		result: category,
	}
}; 

export const addNewCategory = async (ctx, next) => {
	let { category } = ctx.request.body;
	if (!category) {
		return;
	}
	
	category = await model.Category.create(category);
	
	//update new code
	const newCode = generateCode(category.id + 7, CATEGORY_PREFIX_CODE, CATEGORY_CODE_LENGTH);
	category.code = newCode;
	category = await category.save();

	ctx.body = category;
};

export const editCategory = async (ctx, next) => {
	let category = await model.Category.findOne({
		where: {
			code: ctx.params.code,
		},
	});

	if (!category) {
		ctx.throw(`Can not found category with code: ${ctx.params.code}`, 500);
	}

	const request = ctx.request.body.category;

	category.name = request.name;
	category.description = request.description;
	category = await category.save();

	ctx.body = category;
}