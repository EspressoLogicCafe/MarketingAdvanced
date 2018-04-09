# MarketingAdvanced

3/29
	- working properties reader basically running, needs testing...
4/4
	- working using Startup Listener for properties
	- working load resources-to-audit from properties, or database table
4/8
	- add Multi-DB resources (affects MktConfOffers logic, and MktMgmt Schema)
	- issues with Multi-DB (Virtual FKs):
		-- Parent Lookup bug fix (in build 3928, not field available)
		-- Null Parent Lookup (fix pending)
