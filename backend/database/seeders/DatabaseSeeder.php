<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Review;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user — set SEED_ADMIN_PASSWORD in .env before running in any shared environment
        $adminPassword = env('SEED_ADMIN_PASSWORD');
        if (!$adminPassword) {
            throw new \RuntimeException('SEED_ADMIN_PASSWORD must be set in .env before seeding.');
        }

        User::create([
            'name'     => 'ArtisanHome Admin',
            'email'    => 'admin@artisanhome.com',
            'password' => Hash::make($adminPassword),
        ])->forceFill(['is_admin' => true])->save();

        // Sample customer (dev/staging only — remove this block for production)
        $customerPassword = env('SEED_CUSTOMER_PASSWORD', $adminPassword);
        User::create([
            'name'     => 'Amina Wanjiru',
            'email'    => 'amina@example.com',
            'password' => Hash::make($customerPassword),
        ]);

        // Categories
        $categories = [
            ['name' => 'Living Room', 'slug' => 'living-room', 'image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'],
            ['name' => 'Dining',      'slug' => 'dining',      'image' => 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600'],
            ['name' => 'Bedroom',     'slug' => 'bedroom',     'image' => 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'],
            ['name' => 'Office',      'slug' => 'office',      'image' => 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600'],
            ['name' => 'Outdoor',     'slug' => 'outdoor',     'image' => 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=600'],
            ['name' => 'Decor',       'slug' => 'decor',       'image' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // Products
        $products = [
            [
                'name'           => 'Oslo Lounge Chair',
                'slug'           => 'oslo-lounge-chair',
                'price'          => 58000,
                'original_price' => 72000,
                'category_id'    => 1,
                'material'       => 'Full-Grain Leather',
                'finish'         => 'Walnut',
                'dimensions'     => '32"W × 34"D × 33"H',
                'weight'         => '48 lbs',
                'stock'          => 12,
                'colors'         => ['Cognac', 'Midnight', 'Ivory'],
                'is_featured'    => true,
                'is_best_seller' => true,
                'rating'         => 4.8,
                'reviews_count'  => 124,
                'description'    => 'The Oslo Lounge Chair embodies Scandinavian design principles — clean lines, exceptional comfort, and masterful craftsmanship. Upholstered in full-grain leather with hand-stitched details, paired with a solid walnut frame that ages beautifully over time.',
                'images'         => [
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
                    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
                ],
            ],
            [
                'name'           => 'Maren Sectional Sofa',
                'slug'           => 'maren-sectional-sofa',
                'price'          => 148000,
                'original_price' => null,
                'category_id'    => 1,
                'material'       => 'Belgian Linen',
                'finish'         => 'Natural Oak',
                'dimensions'     => '112"W × 68"D × 32"H',
                'weight'         => '220 lbs',
                'stock'          => 5,
                'colors'         => ['Sand', 'Slate', 'Chalk'],
                'is_featured'    => true,
                'is_best_seller' => true,
                'rating'         => 4.9,
                'reviews_count'  => 89,
                'description'    => 'Our most-loved sofa, the Maren Sectional redefines lounging luxury. Crafted with sustainably sourced Belgian linen and a kiln-dried hardwood frame, this is furniture designed for generations.',
                'images'         => [
                    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
                ],
            ],
            [
                'name'           => 'Vela Dining Table',
                'slug'           => 'vela-dining-table',
                'price'          => 98000,
                'original_price' => null,
                'category_id'    => 2,
                'material'       => 'Solid White Oak',
                'finish'         => 'Natural',
                'dimensions'     => '84"W × 40"D × 30"H',
                'weight'         => '145 lbs',
                'stock'          => 8,
                'colors'         => ['Natural Oak', 'Dark Walnut', 'White'],
                'is_featured'    => true,
                'is_best_seller' => true,
                'rating'         => 4.9,
                'reviews_count'  => 72,
                'description'    => 'The Vela Dining Table is a testament to the beauty of natural wood. Each table features a uniquely grained solid white oak top, hand-finished to reveal the wood\'s natural character.',
                'images'         => [
                    'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800',
                ],
            ],
            [
                'name'           => 'Haven Bed Frame',
                'slug'           => 'haven-bed-frame',
                'price'          => 88500,
                'original_price' => null,
                'category_id'    => 3,
                'material'       => 'Bouclé & Solid Walnut',
                'finish'         => 'Dark Walnut',
                'dimensions'     => 'King: 80"W × 86"D × 56"H',
                'weight'         => '185 lbs',
                'stock'          => 10,
                'colors'         => ['Oatmeal Bouclé', 'Charcoal Bouclé', 'Sage'],
                'is_featured'    => true,
                'is_best_seller' => true,
                'rating'         => 4.8,
                'reviews_count'  => 143,
                'description'    => 'The Haven Bed Frame\'s high upholstered headboard creates a sanctuary-like atmosphere in any bedroom.',
                'images'         => [
                    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
                ],
            ],
            [
                'name'           => 'Studio Writing Desk',
                'slug'           => 'studio-writing-desk',
                'price'          => 44000,
                'original_price' => 54500,
                'category_id'    => 4,
                'material'       => 'Solid Walnut',
                'finish'         => 'Oil Finish',
                'dimensions'     => '60"W × 28"D × 30"H',
                'weight'         => '75 lbs',
                'stock'          => 15,
                'colors'         => ['Dark Walnut', 'Natural'],
                'is_featured'    => false,
                'is_best_seller' => false,
                'rating'         => 4.6,
                'reviews_count'  => 38,
                'description'    => 'A desk worthy of your best ideas. The Studio Writing Desk combines a minimalist silhouette with functional details.',
                'images'         => [
                    'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800',
                ],
            ],
        ];

        foreach ($products as $productData) {
            $images = $productData['images'];
            unset($productData['images']);

            $product = Product::create($productData);

            foreach ($images as $i => $url) {
                $product->images()->create(['url' => $url, 'sort_order' => $i]);
            }
        }

        // Sample reviews
        $user = User::where('email', 'sarah@example.com')->first();
        Review::create([
            'product_id' => 1,
            'user_id'    => $user->id,
            'rating'     => 5,
            'comment'    => 'Absolutely stunning piece. The craftsmanship is impeccable — better than the photos.',
        ]);
    }
}
