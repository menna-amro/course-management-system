using Microsoft.EntityFrameworkCore;
using CourseManagementAPI;
using CourseManagementAPI.DTOs;
using CourseManagementAPI.Services.Interfaces;
using CourseManagementAPI.Models;

namespace CourseManagementAPI.Services.Implementations
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly AppDbContext _context;

        public EnrollmentService(AppDbContext context)
        {
            _context = context;
        }


        // ================= STUDENT ENROLL HIMSELF =================

        public async Task EnrollStudentAsync(
            CreateStudentEnrollmentDto dto,
            string userId)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (student == null)
                throw new Exception("Student profile not found");


            var exists = await _context.Enrollments.AnyAsync(e =>
                e.StudentId == student.Id &&
                e.CourseId == dto.CourseId);

            if (exists)
                throw new Exception("Already enrolled in this course");


            var enrollment = new Enrollment
            {
                StudentId = student.Id,
                CourseId = dto.CourseId
            };

            _context.Enrollments.Add(enrollment);

            await _context.SaveChangesAsync();
        }


        // ================= ADMIN ENROLL ANY STUDENT =================

        public async Task EnrollStudentByAdminAsync(
            CreateAdminEnrollmentDto dto)
        {
            var studentExists = await _context.Students
                .AnyAsync(s => s.Id == dto.StudentId);

            if (!studentExists)
                throw new Exception("Student not found");


            var courseExists = await _context.Courses
                .AnyAsync(c => c.Id == dto.CourseId);

            if (!courseExists)
                throw new Exception("Course not found");


            var exists = await _context.Enrollments.AnyAsync(e =>
                e.StudentId == dto.StudentId &&
                e.CourseId == dto.CourseId);

            if (exists)
                throw new Exception("Already enrolled");


            var enrollment = new Enrollment
            {
                StudentId = dto.StudentId,
                CourseId = dto.CourseId
            };

            _context.Enrollments.Add(enrollment);

            await _context.SaveChangesAsync();
        }


        // ================= GET MY COURSES =================

        public async Task<IEnumerable<EnrollmentDto>> GetStudentCoursesAsync(
            string userId)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (student == null)
                return new List<EnrollmentDto>();

            return await _context.Enrollments
                .Where(e => e.StudentId == student.Id)
                .AsNoTracking()
                .Select(e => new EnrollmentDto
                {
                    StudentId = e.StudentId,
                    CourseId = e.CourseId,
                    StudentName = e.Student.Name,
                    CourseTitle = e.Course.Title,
                    InstructorName = e.Course.Instructor.Name
                })
                .ToListAsync();
        }

        public async Task WithdrawStudentAsync(string userId, int courseId)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (student == null)
                throw new Exception("Student profile not found");

            await DeleteAsync(student.Id, courseId);
        }


        // ================= GET COURSE STUDENTS =================

        public async Task<IEnumerable<EnrollmentDto>> GetCourseStudentsAsync(
            int courseId)
        {
            return await _context.Enrollments
                .Where(e => e.CourseId == courseId)
                .AsNoTracking()
                .Select(e => new EnrollmentDto
                {
                    StudentId = e.StudentId,
                    CourseId = e.CourseId,
                    StudentName = e.Student.Name,
                    CourseTitle = e.Course.Title
                })
                .ToListAsync();
        }


        // ================= DELETE ENROLLMENT =================

        public async Task DeleteAsync(int studentId, int courseId)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e =>
                    e.StudentId == studentId &&
                    e.CourseId == courseId);

            if (enrollment == null)
                throw new Exception("Enrollment not found");


            _context.Enrollments.Remove(enrollment);

            await _context.SaveChangesAsync();
        }
    }
}