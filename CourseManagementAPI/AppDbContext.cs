using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CourseManagementAPI.Models;

namespace CourseManagementAPI
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // DB TABLES

        public DbSet<Student> Students { get; set; }

        public DbSet<Course> Courses { get; set; }

        public DbSet<Instructor> Instructors { get; set; }

        public DbSet<InstructorProfile> InstructorProfiles { get; set; }

        public DbSet<Enrollment> Enrollments { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            // UNIQUE STUDENT EMAIL
            modelBuilder.Entity<Student>()
                .HasIndex(s => s.Email)
                .IsUnique();


            // UNIQUE INSTRUCTOR EMAIL
            modelBuilder.Entity<InstructorProfile>()
                .HasIndex(p => p.Email)
                .IsUnique();


            // UNIQUE COURSE TITLE PER INSTRUCTOR
            modelBuilder.Entity<Course>()
                .HasIndex(c => new { c.Title, c.InstructorId })
                .IsUnique();


            // COMPOSITE KEY (Enrollment)
            modelBuilder.Entity<Enrollment>()
                .HasKey(e => new { e.StudentId, e.CourseId });


            // User ↔ Student (One-to-One)
            modelBuilder.Entity<Student>()
                .HasOne(s => s.User)
                .WithOne(u => u.Student)
                .HasForeignKey<Student>(s => s.UserId)
                .OnDelete(DeleteBehavior.SetNull);


            // User ↔ Instructor (One-to-One)
            modelBuilder.Entity<Instructor>()
                .HasOne(i => i.User)
                .WithOne(u => u.Instructor)
                .HasForeignKey<Instructor>(i => i.UserId)
                .OnDelete(DeleteBehavior.SetNull);


            // Instructor ↔ Profile (One-to-One)
            modelBuilder.Entity<Instructor>()
                .HasOne(i => i.Profile)
                .WithOne(p => p.Instructor)
                .HasForeignKey<InstructorProfile>(p => p.InstructorId);


            // Student ↔ Enrollment (One-to-Many)
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Student)
                .WithMany(s => s.Enrollments)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Cascade);


            // Course ↔ Enrollment (One-to-Many)
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(e => e.CourseId);
        }
    }
}