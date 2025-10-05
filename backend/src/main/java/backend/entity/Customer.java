package backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"transactions"})
@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    // Script uses column name `fullname` (no camel break)
    private String fullname;
    private String phone;
    private String email;

    @Column(name = "companyName")
    private String companyName;

    @Column(columnDefinition = "TEXT")
    private String demand;

    @Column(name = "createdDate", insertable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "modifiedDate", insertable = false, updatable = false)
    private LocalDateTime modifiedDate;

    @Builder.Default
    @OneToMany(mappedBy = "customer")
    private Set<Transaction> transactions = new LinkedHashSet<>();
}


