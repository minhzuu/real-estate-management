package backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    /**
     * Upload a file to Cloudinary and return the secure URL.
     *
     * @param file   the multipart file to upload
     * @param folder the Cloudinary folder to store the file in (e.g. "buildings")
     * @return the secure URL of the uploaded file
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        Map<?, ?> params = ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "auto"
        );

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
        String secureUrl = (String) uploadResult.get("secure_url");

        log.info("Uploaded file to Cloudinary: {}", secureUrl);
        return secureUrl;
    }

    /**
     * Delete a file from Cloudinary by its public ID.
     */
    public void deleteFile(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        log.info("Deleted file from Cloudinary: {}", publicId);
    }
}
