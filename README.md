# MarketingAdvanced

3/29
	- working properties reader basically running, needs testing...
4/4
	- working using Startup Listener for properties
	- working load resources-to-audit from properties, or database table
4/8
	- add Multi-DB resources (affects MktConfOffers logic, and MktMgmt Schema)
	- issues with Multi-DB (Virtual FKs):
		-- Parent Lookup bug fix DE351475: Parent Lookup fails across DBs (MultiDB Parent Lookup)
			-- (in build 3928, not field available)
		-- Null Parent Lookup (fix pending) - DE356832: Multi-DB Null Virtual FK value makes data unreadable
	- plus, required getTeamSpace()
4/14
	- fix bug in missing properties file
	- set up for per-teamspace property file
4/19
	- preliminary use of getTeamSpace().name in startup listener
4/21
	- use urlFragment instead of name
4/23
	- use SysUtility instead of ListenerUtil, running