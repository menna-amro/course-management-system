using System.ComponentModel.DataAnnotations;

public class CreateCourseDto
{
    [Required]
    [MaxLength(100)]
    public required string Title { get; set; }

    [Required]
    public int InstructorId { get; set; }
}