﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Security.Claims;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {

    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IsHostRequirementHandler(DataContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return;

            var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
                .SingleOrDefault(x => x.Key == "id").Value?.ToString());

            var attendee = await _context.ActivityAttendees
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == activityId);

            if (attendee == null)
                return;

            if (attendee.IsHost)
                context.Succeed(requirement);
        }
    }
}
