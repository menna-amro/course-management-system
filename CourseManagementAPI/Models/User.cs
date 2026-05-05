using Microsoft.AspNetCore.Identity;

namespace CourseManagementAPI.Models
{
    public class User : IdentityUser
    {
        public string Role { get; set; } = string.Empty;

        public Student? Student { get; set; }

        public Instructor? Instructor { get; set; }
    }
}