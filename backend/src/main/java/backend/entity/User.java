package backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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
@ToString(exclude = {"role", "assignedBuildings", "transactions"})
@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(unique = true)
    private String username;

    private String password;
    private String fullname;

    // TINYINT -> use Integer or Boolean as needed; keep Integer to match column
    private Integer status;

    private String avatar;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "assignmentbuilding",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "building_id")
    )
    private Set<Building> assignedBuildings = new LinkedHashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "staff")
    private Set<Transaction> transactions = new LinkedHashSet<>();
}


