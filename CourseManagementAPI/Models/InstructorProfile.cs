using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.Models
{
    public class InstructorProfile
    {
        public int Id { get; set; }

        [Required]
        public string Email { get; set; } = string.Empty;

        public string? Address { get; set; }

        public int InstructorId { get; set; }

        public Instructor Instructor { get; set; } = null!;
    }
}