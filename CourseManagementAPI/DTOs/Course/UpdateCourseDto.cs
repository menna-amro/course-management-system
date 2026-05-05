using System.ComponentModel.DataAnnotations;

public class UpdateCourseDto
{
    [Required]
    [MaxLength(100)]
    public required string Title { get; set; }

    [Required]
    public int InstructorId { get; set; }
}