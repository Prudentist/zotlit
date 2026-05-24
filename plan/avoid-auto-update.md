# Avoid Upstream Auto-Updates

## Summary

This fork should install as a separate Zotero add-on and a separate Obsidian plugin so upstream releases cannot replace local fork builds through matching IDs or update metadata.

Chosen fork identities:

- Obsidian plugin ID: `zotlit-corey`
- Obsidian plugin name: `ZotLit Corey`
- Zotero add-on ID: `zotero-obsidian-note@corey.local`
- Zotero add-on name: `Obsidian Note for Zotero (Corey Fork)`

## Implementation

- Change the Obsidian manifests to use the fork-specific ID and display name.
- Change the Zotero package metadata to use the fork-specific add-on ID and display name.
- Remove the Zotero upstream update metadata from `app/zotero/package.json`.
- Make `zotero.update` optional in the local schema and builder types.
- Generate Zotero `manifest.json` and `install.rdf` without `update_url` / `updateURL` when no update metadata is configured.
- Make update manifest generation return no output when the package has no update metadata.

## Verification

- Build the Zotero XPI and inspect the packaged `manifest.json`.
  - `applications.zotero.id` should be `zotero-obsidian-note@corey.local`.
  - `applications.zotero.update_url` should be absent.
- Inspect the packaged `install.rdf`.
  - `<em:id>` should be `zotero-obsidian-note@corey.local`.
  - `<em:updateURL>` should be absent.
- Build or package the Obsidian plugin and inspect its `manifest.json`.
  - `id` should be `zotlit-corey`.
  - `name` should be `ZotLit Corey`.

## Notes

- This plan intentionally does not configure a replacement update server.
- Fork updates should be installed manually unless a private update channel is added later.
- The `obsidian://zotero/...` protocol path is left unchanged so Zotero and Obsidian communication keeps working.
