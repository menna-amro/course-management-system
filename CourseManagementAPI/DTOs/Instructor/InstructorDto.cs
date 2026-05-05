namespace CourseManagementAPI.DTOs
{
    public class InstructorDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
    }
}