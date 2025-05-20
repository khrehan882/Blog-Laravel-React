<?php

namespace App\Http\Controllers;

use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TempImageController extends Controller
{
    public function store(Request $request)
    {
        $Validator = Validator::make($request->all(), [
            'image' => 'required|image',
        ]);
        if ($Validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please fix the errors',
                'errors' => $Validator->errors()
            ], 422);
        }
        //Upload image here
        $image = $request->image;

        $ext = $image->getClientOriginalExtension();
        $imageName = time() . '.' . $ext;


        // Store the image in DB
        $tempImage = new TempImage();
        $tempImage->name = $imageName;
        $tempImage->save();


        // Move the image in temp storage
        $image->move(public_path('uploads/temp'), $imageName);

        return response()->json([
                'status' => true,
                'message' => 'Image Uploaded Successfully',
                'image' => $tempImage
            ], 200);
    }
}
