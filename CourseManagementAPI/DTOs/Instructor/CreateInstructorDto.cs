using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.DTOs
{
    public class CreateInstructorDto
    {
        [Required]
        [MaxLength(100)]
        public required string Name { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }
    }
}