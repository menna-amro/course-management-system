using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.DTOs
{
    public class CreateStudentEnrollmentDto
    {
        [Required]
        public int CourseId { get; set; }
    }
}