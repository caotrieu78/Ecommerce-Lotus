<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ProductView;
use Illuminate\Http\Request;

class ProductViewController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only(['store']);
    }

    //  Ghi nhận lượt xem sản phẩm
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ProductID' => 'required|exists:Product,ProductID',
            'DurationSeconds' => 'nullable|integer|min:1',
        ]);

        $view = ProductView::create([
            'ProductID' => $validated['ProductID'],
            'UserID' => auth()->id(),
            'ViewedAt' => now(),
            'DurationSeconds' => $validated['DurationSeconds'] ?? null,
        ]);

        return response()->json(['message' => 'Đã ghi lượt xem'], 201);
    }

    // Admin: xem lượt xem sản phẩm (top N sản phẩm theo lượt xem)
    public function topViewed()
    {
        $views = ProductView::selectRaw('ProductID, COUNT(*) as TotalViews')
            ->groupBy('ProductID')
            ->orderByDesc('TotalViews')
            ->with('product')
            ->take(10)
            ->get();

        return response()->json($views);
    }
}
