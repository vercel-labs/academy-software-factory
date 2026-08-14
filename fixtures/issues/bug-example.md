# Uppercase channel names fail

Customers loading channel names from environment variables sometimes pass `SLACK` instead of `slack`. Normalize channel names before selecting a provider and add a regression test.

