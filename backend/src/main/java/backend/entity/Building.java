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
@ToString(exclude = {"rentAreas", "rentTypes", "assignedUsers", "district"})
@Entity
@Table(name = "building")
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String name;
    private String street;
    private String ward;
    private String structure;

    @Column(name = "numberOfBasement")
    private Integer numberOfBasement;

    @Column(name = "floorArea")
    private Integer floorArea;

    @Column(name = "rentPrice")
    private Double rentPrice;

    @Column(name = "rentPriceDescription", columnDefinition = "TEXT")
    private String rentPriceDescription;

    @Column(name = "serviceFee")
    private String serviceFee;

    @Column(name = "carFee")
    private String carFee;

    @Column(name = "motorbikeFee")
    private String motorbikeFee;

    @Column(name = "overtimeFee")
    private String overtimeFee;

    @Column(name = "waterFee")
    private String waterFee;

    @Column(name = "electricityFee")
    private String electricityFee;

    private String deposit;
    private String payment;

    @Column(name = "rentTime")
    private String rentTime;

    @Column(name = "decorationTime")
    private String decorationTime;

    @Column(name = "brokerageFee")
    private String brokerageFee;

    private String type;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "linkOfBuilding")
    private String linkOfBuilding;

    private String map;
    private String image;

    @Column(name = "createdDate", insertable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "modifiedDate", insertable = false, updatable = false)
    private LocalDateTime modifiedDate;

    @Column(name = "createdBy")
    private String createdBy;

    @Column(name = "modifiedBy")
    private String modifiedBy;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    @Builder.Default
    @OneToMany(mappedBy = "building")
    private Set<RentArea> rentAreas = new LinkedHashSet<>();

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "buildingrenttype",
            joinColumns = @JoinColumn(name = "building_id"),
            inverseJoinColumns = @JoinColumn(name = "renttype_id")
    )
    private Set<RentType> rentTypes = new LinkedHashSet<>();

    @Builder.Default
    @ManyToMany(mappedBy = "assignedBuildings")
    private Set<User> assignedUsers = new LinkedHashSet<>();
}


