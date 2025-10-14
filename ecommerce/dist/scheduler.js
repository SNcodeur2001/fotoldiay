import { ProductController } from './modules/product/product.controller.js';
import { ProductService } from './modules/product/product.service.js';
import { ProductRepository } from './modules/product/product.repository.js';
// Create product controller instance with dependencies
const repository = new ProductRepository();
const service = new ProductService(repository);
const productController = new ProductController(service);
// Schedule weekly cleanup (runs every Sunday at 2 AM)
export function scheduleWeeklyCleanup() {
    // Run cleanup immediately for testing
    console.log('Running initial cleanup...');
    productController.cleanupExpiredProducts()
        .then(count => console.log(`Initial cleanup completed: ${count} products expired`))
        .catch(error => console.error('Initial cleanup failed:', error));
    productController.deleteOldExpiredProducts()
        .then(count => console.log(`Initial deletion completed: ${count} products permanently deleted`))
        .catch(error => console.error('Initial deletion failed:', error));
    // Set up weekly schedule
    const now = new Date();
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + (7 - now.getDay()));
    nextSunday.setHours(2, 0, 0, 0); // 2 AM next Sunday
    const timeUntilNextRun = nextSunday.getTime() - now.getTime();
    setTimeout(() => {
        // Run weekly cleanup
        productController.cleanupExpiredProducts()
            .then(count => console.log(`Weekly cleanup: ${count} products expired`))
            .catch(error => console.error('Weekly cleanup failed:', error));
        productController.deleteOldExpiredProducts()
            .then(count => console.log(`Weekly deletion: ${count} products permanently deleted`))
            .catch(error => console.error('Weekly deletion failed:', error));
        // Schedule next weekly run
        setInterval(() => {
            productController.cleanupExpiredProducts()
                .then(count => console.log(`Weekly cleanup: ${count} products expired`))
                .catch(error => console.error('Weekly cleanup failed:', error));
            productController.deleteOldExpiredProducts()
                .then(count => console.log(`Weekly deletion: ${count} products permanently deleted`))
                .catch(error => console.error('Weekly deletion failed:', error));
        }, 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
    }, timeUntilNextRun);
    console.log(`Weekly cleanup scheduled. Next run: ${nextSunday.toISOString()}`);
}
