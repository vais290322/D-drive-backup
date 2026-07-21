/**
 * Script to enhance product data with rating, stock, and reviewCount fields
 * Run with: node enhanceProducts.js
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SAMPLE_DATA_PATH = join(__dirname, "src", "data", "sampleData.js");

// Read the file
let fileContent = readFileSync(SAMPLE_DATA_PATH, "utf8");

// Generate realistic random values
function getRandomRating() {
  const ratings = [4.0, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0];
  return ratings[Math.floor(Math.random() * ratings.length)];
}

function getRandomStock() {
  const stocks = [0, 12, 25, 45, 67, 78, 85, 92, 100];
  return stocks[Math.floor(Math.random() * stocks.length)];
}

function getRandomReviewCount() {
  return Math.floor(Math.random() * 150) + 5; // 5-154 reviews
}

// Track which products we've already enhanced
const enhancedProducts = new Set();

// Function to add fields after the `inStock` field in each product
function enhanceProduct(
  match,
  productId,
  beforeInStock,
  inStockLine,
  afterInStock
) {
  // Skip if already enhanced (has stock field)
  if (afterInStock.includes("stock:")) {
    return match;
  }

  // Skip if we already enhanced this product
  if (enhancedProducts.has(productId)) {
    return match;
  }

  enhancedProducts.add(productId);

  const rating = getRandomRating();
  const stock = getRandomStock();
  const reviewCount = getRandomReviewCount();

  // Add the new fields after inStock
  const enhancement = `${inStockLine}
    stock: ${stock},
    rating: ${rating},
    reviewCount: ${reviewCount},`;

  return `${beforeInStock}${enhancement}${afterInStock}`;
}

// Regex pattern to match each product entry
// This captures: product ID, content before inStock, the inStock line, and content after
const productPattern =
  /(id:\s*"(p\d+)",[\s\S]*?)(inStock:\s*(?:true|false),)([\s\S]*?)(?=(?:},\s*{[\s\S]*?id:\s*"|}\s*\];))/g;

// Apply enhancement to all products
fileContent = fileContent.replace(productPattern, enhanceProduct);

console.log(`Enhanced ${enhancedProducts.size} products`);

// Write back to file
writeFileSync(SAMPLE_DATA_PATH, fileContent, "utf8");

console.log("✅ Successfully enhanced all products!");
console.log("Added fields: rating, stock, reviewCount");
