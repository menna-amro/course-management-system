using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.Models
{
    public class Course
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public int InstructorId { get; set; }

        public Instructor Instructor { get; set; } = null!;

        public ICollection<Enrollment> Enrollments { get; set; }
            = new List<Enrollment>();
    }
}