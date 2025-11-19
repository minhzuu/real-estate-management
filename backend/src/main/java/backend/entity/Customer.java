package backend.entity;

import jakarta.persistence.*;

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
@ToString(exclude = {"createdBy", "assignedStaff", "transactions"})
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

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Builder.Default
    @ManyToMany(mappedBy = "assignedCustomers")
    private Set<User> assignedStaff = new LinkedHashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "customer")
    private Set<Transaction> transactions = new LinkedHashSet<>();
}


