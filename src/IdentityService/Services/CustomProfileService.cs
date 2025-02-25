using System.Security.Claims;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using IdentityModel;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;

namespace IdentityService.Services;

public class CustomProfileService : IProfileService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public CustomProfileService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }
    public async Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var user = await _userManager.GetUserAsync(context.Subject);
        var exisitingClaims = await _userManager.GetClaimsAsync(user!);

        var claims = new List<Claim>
        {
            new("username", user!.UserName!)
        };

        context.IssuedClaims.AddRange(claims);
        context.IssuedClaims.Add(exisitingClaims.FirstOrDefault(x => x.Type == JwtClaimTypes.Name)!);
    }

    public Task IsActiveAsync(IsActiveContext context)
    {
        return Task.CompletedTask;
    }
}
