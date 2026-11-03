import Product from "../Entities/product.js";
import Category from "../Entities/category.js";
import { AppDataSource } from "../DB/datasource.js";

const productRepository = AppDataSource.getRepository(Product);
const categoryRepository = AppDataSource.getRepository(Category);

export async function findProductById(id){
       //find by id
      const Product = await productRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          Category: true,
        },
      });
      return Product;
}

export async function allProducts(ctx){
const Products = AppDataSource.getRepository(Product);
      const ProductsList = await Products.find({
        relations: {
          Category: true,
        },
      });
      return ProductsList;
}

export async function addProduct(data) {
  const {name,description,stock,price,imageURL,category}= data;
  const product = productRepository.create({
    name,
    description,
    stock,
    price,
    imageURL,
    Category: {
      id: category
    }
  })
  await productRepository.save(product);
  return product;
}

export async function addCategory(data) {
  const {name} = data;
  const category = categoryRepository.create({
    name
  })
  return categoryRepository.save(category);
}

export async function allCategories() {
  return categoryRepository.find({
    order: {
      id: "ASC",
    },
  });
}

export async function findCategoryById(id) {
  return categoryRepository.findOne({
    where: { id },
  });
}

export async function updateCategory(id, updateDetails) {
  const result = await categoryRepository.update({ id }, updateDetails);
  if (!result.affected) {
    return null;
  }
  return findCategoryById(id);
}

export async function categoryHasProducts(id) {
  return productRepository.exist({
    where: {
      Category: { id },
    },
  });
}

export async function removeCategory(id) {
  const result = await categoryRepository.delete({ id });
  return Boolean(result.affected);
}

export async function productDetailsUpdate(id, updateDetails) {
  const { category, ...productFields } = updateDetails;

  await productRepository.update(
    { id },
    {
      ...productFields,
      ...(category !== undefined && { Category: { id: category } }),
    }
  );

  return findProductById(id);
}

export async function removeProduct(id) {
  await productRepository.delete({id});
}

export async function searchQueryProduct(
    offset,
    limit,
    category,
    minPrice,
    maxPrice,
    sort
) {
    const query = productRepository
        .createQueryBuilder("product");

    if (category) {
        query
            .leftJoin("product.Category", "category")
            .andWhere("category.name = :category", {
                category
            });
    }

    if (minPrice !== undefined) {
    query.andWhere("product.price >= :minPrice", { minPrice });
}

if (maxPrice !== undefined) {
    query.andWhere("product.price <= :maxPrice", { maxPrice });
}

    query
        .orderBy("product.id", sort === "DESC" ? "DESC" : "ASC")
        .skip(offset)
        .take(limit);

    const [products, total] = await query.getManyAndCount();

    return [products, total];
}