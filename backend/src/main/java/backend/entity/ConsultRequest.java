package backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "consult_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerPhone;

    private String customerEmail;

    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConsultStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdDate;

    public enum ConsultStatus {
        PENDING,
        CONTACTED,
        COMPLETED,
        CANCELLED
    }
}

