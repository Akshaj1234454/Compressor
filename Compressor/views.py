from django.shortcuts import render, redirect
from django.http import HttpResponse, FileResponse
from django.template.loader import get_template
import os
import zipfile
from io import BytesIO
from PIL import Image
def homePage(request):
    
    return render(request, 'home.html')
    
def resultPage(request):
    if request.method == 'POST':
        try:
            
            quality_setting = request.POST.get("qualitySelector")
            
            uploaded_files = request.FILES.getlist('images')
            
            if not uploaded_files:
                return HttpResponse('No files were uploaded.', status=400, content_type='text/plain')
            
            # Convert quality setting to numeric value
            if quality_setting == 'High':
                quality_setting = 90
            elif quality_setting == 'Medium':
                quality_setting = 50
            elif quality_setting == 'Very Low':
                quality_setting = 25
            else:
                return HttpResponse('Invalid quality setting.', status=400, content_type='text/plain')
            
            
            if len(uploaded_files) == 1:
                file = uploaded_files[0]
                if not file.content_type.startswith('image/'):
                    return HttpResponse('Uploaded file is not an image.', status=400)
                
                output = imageCompressAndSave(file, quality_setting)
                response = FileResponse(output, as_attachment=True, filename=file.name)
                response['Content-Type'] = 'image/jpeg'  # Set correct content type
                return response
            else:
                zip_buffer = BytesIO()
                with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                    for file in uploaded_files:
                        if not file.content_type.startswith('image/'):
                            continue
                        
                        output = imageCompressAndSave(file, quality_setting)
                        zip_file.writestr(file.name, output.getvalue())
                zip_buffer.seek(0)
                response = FileResponse(zip_buffer, as_attachment=True, filename='compressed_images.zip')
                response['Content-Type'] = 'application/zip'  # Set correct content type
                return response
        except Exception as e:
            return HttpResponse(str(e), status=400, content_type='text/plain')
def imageCompressAndSave(imageName, qualitySetting):

    img = Image.open(imageName)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    output = BytesIO()
    img.save(output, format="JPEG", quality=qualitySetting)
    output.seek(0)
    return output
