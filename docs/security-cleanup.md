# Security Cleanup Guide

## Removing Sensitive Files from Git History

We've updated the `.gitignore` file to prevent committing sensitive files like `.env.production`, but if these files were already committed, they still exist in the git history and are accessible.

Follow these steps to remove sensitive files from the git repository history:

### Before You Begin

⚠️ **Warning**: The following commands will rewrite git history. This can affect all collaborators who will need to reclone or follow special procedures after this change.

1. Ensure you have a backup of your repository
2. Make sure all changes are committed
3. Communicate with your team members about this operation

### Removing .env.production Files

```bash
# First, confirm the files you want to remove are properly added to .gitignore
git status

# Execute the filter-branch command to remove the files from history
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env.production Backend/.env.production frontend/.env.production" --prune-empty --tag-name-filter cat -- --all

# Force push changes to remote repository
git push origin --force --all

# Force push tags as well
git push origin --force --tags
```

### Clean Up

After successfully removing the sensitive files, clean up your local repository:

```bash
# Remove the old refs
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin

# Expire all refs
git reflog expire --expire=now --all

# Garbage collect
git gc --prune=now
```

### What to Do Next

1. Immediately revoke and rotate all exposed credentials
2. Create new API keys and secrets
3. Update production systems with the new credentials
4. Verify the sensitive information is no longer in the git history

## Configuring Environment Variables for Vercel

Instead of storing production environment variables in `.env.production` files, use Vercel's built-in environment variables feature:

1. Log in to the Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each environment variable from your `.env.production` files
5. Deploy your application

This approach is more secure as it keeps sensitive data out of your codebase entirely.

## Resources

- [Git - git-filter-branch Documentation](https://git-scm.com/docs/git-filter-branch)
- [Vercel - Environment Variables](https://vercel.com/docs/environment-variables) 