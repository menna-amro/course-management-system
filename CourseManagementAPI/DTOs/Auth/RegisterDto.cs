using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.DTOs.Auth
{
    public class RegisterDto
    {
        [Required]
        [MinLength(3)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [RegularExpression("Admin|Instructor|Student",
            ErrorMessage = "Role must be Admin, Instructor, or Student only")]
        public string Role { get; set; } = string.Empty;
    }
}