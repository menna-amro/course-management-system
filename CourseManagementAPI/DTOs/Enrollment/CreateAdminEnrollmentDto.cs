using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.DTOs
{
    public class CreateAdminEnrollmentDto
    {
        [Required]
        public int StudentId { get; set; }

        [Required]
        public int CourseId { get; set; }
    }
}