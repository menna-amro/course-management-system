using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.DTOs.Student
{
    public class UpdateStudentDto
    {
        public string? Name { get; set; }

        [EmailAddress]
        public string? Email { get; set; }
    }
}
