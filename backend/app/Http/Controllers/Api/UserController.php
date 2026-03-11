<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function update(Request $request) {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $request->user()->id,
            'phone' => 'nullable|string',
        ]);
        $request->user()->update($data);
        return response()->json($request->user()->fresh());
    }

    public function addresses(Request $request) {
        return response()->json($request->user()->addresses);
    }

    public function addAddress(Request $request) {
        $data = $request->validate([
            'address_line1' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip' => 'required|string',
            'country' => 'required|string',
            'is_default' => 'boolean',
        ]);
        $address = $request->user()->addresses()->create($data);
        return response()->json($address, 201);
    }

    public function deleteAddress(Request $request, $address) {
        $request->user()->addresses()->where('id', $address)->delete();
        return response()->json(['message' => 'Address deleted']);
    }
}
