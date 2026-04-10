package backend.controller;

import backend.dto.response.ApiResponse;
import backend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "buildings") String folder) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<Map<String, String>>builder()
                            .message("File is empty")
                            .build());
        }

        String url = cloudinaryService.uploadFile(file, folder);

        return ResponseEntity.ok(
                ApiResponse.<Map<String, String>>builder()
                        .result(Map.of("url", url))
                        .message("Upload successful")
                        .build());
    }

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<List<String>>> uploadMultipleImages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "folder", defaultValue = "buildings") String folder) throws IOException {

        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                urls.add(cloudinaryService.uploadFile(file, folder));
            }
        }

        return ResponseEntity.ok(
                ApiResponse.<List<String>>builder()
                        .result(urls)
                        .message("Upload successful")
                        .build());
    }
}
