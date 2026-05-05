using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.Models
{
    public class Student
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;

        public User User { get; set; } = null!;

        public ICollection<Enrollment> Enrollments { get; set; }
            = new List<Enrollment>();
    }
}