using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.DTOs.Instructor
{
    public class UpdateInstructorDto
    {
        public string? Name { get; set; }

        [EmailAddress]
        public string? Email { get; set; }
    }
}
