using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.Models
{
    public class Instructor
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;

        public User User { get; set; } = null!;

        public InstructorProfile? Profile { get; set; }

        public ICollection<Course> Courses { get; set; }
            = new List<Course>();
    }
}