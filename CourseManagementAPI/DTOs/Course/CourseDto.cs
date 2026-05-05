public class CourseDto  //response DTO
{
    public int Id { get; set; }
    public required string Title { get; set; }

    public int InstructorId { get; set; }
    public required string InstructorName { get; set; }
}