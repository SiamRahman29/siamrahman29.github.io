---
title: "How to Implement Facial Recognition with Python"
summary: "A face-recognition attendance system in Django, end to end. It is easier than you think."
date: 2025-09-03
draft: false
tags: ["tutorial", "python", "django", "computer-vision"]
ogImage: "/writing/facial-recognition-python.png"
---

For my final year project at my university, I worked with a bus company in Malaysia called "Mara Liner". They were starting a philanthropic outreach project to transport Orang Asli children from remote areas of Johor, Perak, and Pahang. For this system, Mara Liner planned to implement airtight transport tracking and a school management system. I, alongside my friend Gaafar, worked on this system. I specifically focused on the systems relating to school management and, as a part of it, I built a facial recognition based attendance recorder and verifier.

![Facial recognition attendance system](/writing/facial-recognition-python.png)

I used Django to build the whole system. For the frontend, I used HTML, CSS, and plain JavaScript. In this article, I'll be focusing solely on the facial recognition based features. I have broken down the whole implementation in 3 steps:

1. Frontend: How I collected the data and propagated it through to the backend
2. Backend: How I process and store the data
3. Verification: How I do the verification and attendance-recording with the data I have stored

## Frontend: Webcam Integration and Image Capture

The frontend handles webcam access, live video streaming, and image capture using modern web APIs.

### HTML Structure

The registration form includes a video element for the live webcam feed and a hidden input field for storing captured image data:

```html
<div id="webcam-container" class="mb-4">
    <video id="webcam" autoplay playsinline class="rounded-md border"></video>
</div>
<input type="hidden" id="id_face_encoding" name="face_encoding">
<button id="capture-btn" type="button">Capture</button>
```

**Key Elements:**
- `<video>` element with `autoplay` and `playsinline` attributes for immediate streaming
- Hidden input field (`face_encoding`) to store the captured image data
- Capture button to trigger photo taking

### JavaScript Implementation

#### 1. Webcam Initialization

The webcam starts automatically when the page loads:

```javascript
const video = document.getElementById('webcam');
const captureBtn = document.getElementById('capture-btn');
const faceEncodingInput = document.getElementById('id_face_encoding');

async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing webcam:', error);
        showCustomAlert('Failed to access webcam.');
    }
}

// Auto-start webcam on page load
window.onload = startWebcam;
```

**Technical Details:**
- Uses WebRTC's `getUserMedia()` API for camera access
- Requests video-only permission (`{ video: true }`)
- Handles permission denial and device unavailability gracefully
- Stream is directly assigned to the video element's `srcObject`

#### 2. Image Capture Process

When the user clicks "Capture", the system takes a snapshot of the current video frame:

```javascript
captureBtn.addEventListener('click', () => {
    // Create an invisible canvas to capture the frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame onto the canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to Base64 PNG data
    const imageData = canvas.toDataURL('image/png');
    
    // Store in hidden form field for submission
    faceEncodingInput.value = imageData;
    
    showCustomAlert('Facial data captured successfully!');
});
```

**Capture Pipeline:**
1. **Canvas Creation**: Creates an invisible HTML5 canvas element
2. **Dimension Matching**: Canvas size matches video's native resolution
3. **Frame Extraction**: Current video frame is drawn onto canvas using `drawImage()`
4. **Image Encoding**: Canvas content converted to Base64 PNG format
5. **Form Storage**: Base64 string stored in hidden input field for form submission

#### 3. User Feedback System

A custom alert system provides immediate feedback:

```javascript
function showCustomAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('custom-alert-message');
    
    alertMessage.textContent = message;
    alertBox.classList.remove('hidden');
    
    // Handle close button
    document.getElementById('custom-alert-close').addEventListener('click', () => {
        alertBox.classList.add('hidden');
    });
}
```

## Django Backend: Form Processing and Data Storage

The Django backend handles form submission, processes the captured image data, and extracts facial encodings for storage.

### Django Form Configuration

The `StudentForm` includes a hidden field for facial data:

```python
class StudentForm(forms.ModelForm):
    face_encoding = forms.CharField(widget=forms.HiddenInput(), required=False)
    
    class Meta:
        model = Student
        fields = ['name', 'ic_no', 'student_class', 'area', 'school', 
                 'guardian_name', 'contact_number', 'face_encoding']
```

**Key Points:**
- `face_encoding` field uses `HiddenInput()` widget (not visible to users)
- Field is optional (`required=False`) to handle cases where no face is captured
- Included in the form fields list for processing

### View Processing Logic

The `register_student` view handles form submission and face encoding extraction:

```python
@login_required
def register_student(request):
    if request.method == 'POST':
        form = StudentForm(request.POST)
        if form.is_valid():
            student = form.save(commit=False)  # Don't save to DB yet
            
            # Extract facial data from form
            face_encoding_img = form.cleaned_data.get('face_encoding')
            if face_encoding_img:
                try:
                    # Process the Base64 image data
                    process_facial_encoding(student, face_encoding_img)
                except Exception as e:
                    print("Error processing face encoding:", e)
            
            student.save()  # Now save to database
            return HttpResponseRedirect(reverse('student:register_success'))
    else:
        form = StudentForm()
    
    return render(request, 'student/register_student.html', {
        'form': form, 
        'title': 'Register Student | MaraLiner Attendance System'
    })
```

### Face Encoding Processing

The system converts the Base64 image to facial encodings:

```python
def process_facial_encoding(student, face_encoding_img):
    # Remove Base64 header if present (data:image/png;base64,)
    if ',' in face_encoding_img:
        face_encoding_img = face_encoding_img.split(',')[1]
    
    # Decode Base64 to binary image data
    image_bytes = base64.b64decode(face_encoding_img)
    
    # Load image using face_recognition library
    image = face_recognition.load_image_file(io.BytesIO(image_bytes))
    
    # Extract face encodings (128-dimensional vectors)
    encodings = face_recognition.face_encodings(image)
    
    if encodings:
        # Use the first detected face
        student.set_face_encoding(encodings[0])
    else:
        print("No face found in the image.")
```

**Processing Steps:**
1. **Base64 Cleanup**: Removes data URL prefix (`data:image/png;base64,`)
2. **Binary Conversion**: Decodes Base64 string to binary image data
3. **Image Loading**: Uses `face_recognition` library to load image from bytes
4. **Face Detection**: Extracts facial features as 128-dimensional vectors
5. **Storage**: Saves the first detected face encoding

### Database Storage Model

The `Student` model includes methods for face encoding management:

```python
class Student(models.Model):
    # ... other fields ...
    face_encoding = models.TextField(blank=True, null=True)  # Store as JSON
    
    def set_face_encoding(self, encoding):
        """Convert numpy array to JSON string for storage"""
        self.face_encoding = json.dumps(encoding.tolist())
    
    def get_face_encoding(self):
        """Retrieve and convert JSON back to numpy array"""
        return np.array(json.loads(self.face_encoding)) if self.face_encoding else None
    
    def update_face_encoding(self, new_encoding):
        """Update existing face encoding"""
        self.set_face_encoding(new_encoding)
        self.save()
```

**Storage Strategy:**
- Face encodings stored as JSON strings in a TextField
- Numpy arrays converted to Python lists for JSON serialization
- Helper methods handle conversion between formats
- Null values allowed for students without facial data

## Verification and Attendance Recording

The final component uses stored face encodings to verify identity and record attendance automatically.

### Real-time Attendance Recording

The attendance system uses the same webcam capture technique but processes images immediately:

```javascript
// In record_attendance.html
captureBtn.addEventListener('click', async () => {
    // Capture image (same process as registration)
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/png');
    
    // Stop webcam after capture
    stream.getTracks().forEach(track => track.stop());
    
    // Send immediately to server for processing
    const response = await fetch('/student/record_attendance/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': '{{ csrf_token }}'
        },
        body: JSON.stringify({ image_data: imageData })
    });
    
    const result = await response.json();
    showCustomAlert(result.message || result.error);
});
```

### Backend Face Matching

The `record_attendance` view performs face matching against all stored encodings:

```python
@csrf_exempt
def record_attendance(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            image_data = body.get('image_data')
            
            # Process the captured image
            image_bytes = base64.b64decode(image_data.split(',')[1])
            image = face_recognition.load_image_file(io.BytesIO(image_bytes))
            
            # Extract face encodings from captured image
            face_encodings = face_recognition.face_encodings(image)
            if not face_encodings:
                return JsonResponse({'error': 'No face detected in the image.'}, 
                                  status=400)
            
            # Compare against all stored student encodings
            captured_encoding = face_encodings[0]
            
            for student in Student.objects.all():
                stored_encoding = student.get_face_encoding()
                if stored_encoding is not None:
                    # Use face_recognition library for comparison
                    matches = face_recognition.compare_faces(
                        [stored_encoding], captured_encoding
                    )
                    
                    if matches[0]:  # Face match found
                        # Record attendance with timestamp
                        gmt_plus_8 = timezone.now().astimezone(
                            pytz_timezone('Asia/Singapore')
                        )
                        Attendance.objects.create(
                            student=student,
                            date=gmt_plus_8.date(),
                            time=gmt_plus_8.time()
                        )
                        return JsonResponse({
                            'message': f'Attendance recorded for {student.name}.'
                        })
            
            return JsonResponse({'error': 'No matching student found.'}, 
                              status=404)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
```

### Face Matching Algorithm

The verification process uses the `face_recognition` library's comparison function:

```python
# Compare captured face against stored encoding
matches = face_recognition.compare_faces([stored_encoding], captured_encoding)

# face_recognition.compare_faces() returns:
# - List of boolean values
# - True if faces match (within tolerance threshold)
# - False if faces don't match or no face detected
```

**Matching Process:**
1. **Face Detection**: Extract encoding from captured image
2. **Database Iteration**: Loop through all registered students
3. **Comparison**: Use `compare_faces()` with default tolerance (0.6)
4. **First Match**: Record attendance for first matching student
5. **Timestamp**: Store current date and time with timezone support

### Attendance Verification System

A secondary verification system allows double-checking attendance:

```python
def process_facial_recognition_for_verification(request):
    # Similar face matching process...
    
    if matches[0]:  # Face match found
        # Check if attendance exists for today
        today = timezone.now().date()
        attendance = Attendance.objects.filter(
            student=student, date=today
        ).first()
        
        if not attendance:
            return JsonResponse({
                'error': f"Attendance for {student.name} wasn't recorded today."
            }, status=404)
        
        if attendance.verified:
            return JsonResponse({
                'message': f"Attendance for {student.name} is already verified."
            })
        
        # Mark attendance as verified
        attendance.verified = True
        attendance.save()
        
        return JsonResponse({
            'message': f"Attendance for {student.name} has been verified."
        })
```

## Key Features and Considerations

### Security Features
- **CSRF Protection**: All forms include CSRF tokens
- **Login Required**: Admin functions require authentication
- **Input Validation**: Form validation prevents malicious data
- **Error Handling**: Comprehensive exception handling

### Performance Optimizations
- **Base64 Encoding**: Efficient for small image data transmission
- **Single Face Detection**: Uses first detected face to reduce processing
- **JSON Storage**: Lightweight storage format for face encodings
- **Timezone Handling**: Proper timestamp management for global deployment

### Browser Compatibility
- **WebRTC Support**: Requires modern browsers with `getUserMedia()` support
- **Canvas API**: Uses HTML5 canvas for image processing
- **HTTPS Requirement**: Camera access requires a secure connection in production

### Limitations and Improvements
- **Sequential Comparison**: Could be optimized with facial indexing
- **No Duplicate Detection**: Same person could register multiple times
- **Single Face Only**: Doesn't handle multiple faces in one image
- **No Live Detection**: Could add blink detection for anti-spoofing

## Conclusion

This facial recognition attendance system demonstrates a complete implementation from frontend webcam integration to backend face encoding storage and verification. The system provides:

1. **User-Friendly Interface**: Simple webcam capture with immediate feedback
2. **Robust Backend Processing**: Secure form handling and face encoding extraction
3. **Reliable Verification**: Accurate face matching for attendance recording

The modular design allows for easy extension and modification, making it suitable for educational institutions, corporate environments, or any scenario requiring automated attendance tracking through facial recognition.

### Next Steps

To enhance this system further, consider:
- Adding anti-spoofing measures (liveness detection)
- Implementing facial recognition confidence scores
- Adding batch processing for multiple faces
- Creating detailed analytics and reporting features
- Implementing mobile app integration
