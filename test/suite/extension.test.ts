import * as assert from 'assert';
import * as vscode from 'vscode';

async function activateMdcLanguage() {
  const doc = await vscode.workspace.openTextDocument({ language: 'mdc', content: '' });
  await vscode.window.showTextDocument(doc);
}

suite('MDC Extension Test Suite', () => {
  let extension: vscode.Extension<any> | undefined;

  suiteSetup(async function() {
    // Set a longer timeout for extension activation
    this.timeout(10000);
    
    // Get the extension
    extension = vscode.extensions.getExtension('nuxt.mdc');
    
    // Ensure extension is activated
    if (extension && !extension.isActive) {
      await extension.activate();
    }
  });

  suite('Extension Installation', () => {
    test('Extension should be present', () => {
      assert.ok(extension, 'Extension nuxt.mdc should be present in installed extensions');
    });

    test('Extension should be activated', () => {
      assert.ok(extension?.isActive, 'Extension should be activated');
    });

    test('Extension should have correct ID', () => {
      assert.strictEqual(extension?.id, 'Nuxt.mdc', 'Extension ID should be nuxt.mdc');
    });

    test('Extension package should have required properties', () => {
      const packageJSON = extension?.packageJSON;
      assert.ok(packageJSON, 'Extension should have packageJSON');
      assert.strictEqual(packageJSON.name, 'mdc', 'Extension name should be mdc');
      assert.strictEqual(packageJSON.publisher, 'Nuxt', 'Extension publisher should be Nuxt');
      assert.ok(packageJSON.version, 'Extension should have a version');
      assert.ok(packageJSON.displayName, 'Extension should have a display name');
    });
  });

  suite('Language Registration', () => {
    test('mdc language should be registered', async () => {
      const languages = await vscode.languages.getLanguages();
      assert.ok(languages.includes('mdc'), 'mdc language should be registered in VS Code');
    });

    test('Extension should contribute mdc language', () => {
      const packageJSON = extension?.packageJSON;
      const languages = packageJSON?.contributes?.languages || [];
      const mdcLanguage = languages.find((lang: any) => lang.id === 'mdc');
      
      assert.ok(mdcLanguage, 'Extension should contribute mdc language');
      assert.ok(mdcLanguage.aliases, 'MDC language should have aliases');
      assert.ok(mdcLanguage.aliases.includes('MDC'), 'MDC language aliases should include "MDC"');
    });

    test('Extension should contribute grammars', () => {
      const packageJSON = extension?.packageJSON;
      const grammars = packageJSON?.contributes?.grammars || [];
      
      assert.ok(grammars.length > 0, 'Extension should contribute at least one grammar');
      
      const mdcStandaloneGrammar = grammars.find((g: any) => 
        g.scopeName === 'text.markdown.mdc.standalone'
      );
      assert.ok(mdcStandaloneGrammar, 'Extension should contribute standalone MDC grammar');
      
      const mdcInjectionGrammar = grammars.find((g: any) => 
        g.scopeName === 'text.markdown.mdc'
      );
      assert.ok(mdcInjectionGrammar, 'Extension should contribute MDC injection grammar');
    });
  });

  suite('Commands Registration', () => {
    test('mdc.showOutput command should be registered', async () => {
      const commands = await vscode.commands.getCommands(true);
      assert.ok(commands.includes('mdc.showOutput'), 'mdc.showOutput command should be registered');
    });

    test('Extension should contribute commands', () => {
      const packageJSON = extension?.packageJSON;
      const commands = packageJSON?.contributes?.commands || [];
      
      assert.ok(commands.length > 0, 'Extension should contribute commands');
      
      const showOutputCmd = commands.find((cmd: any) => cmd.command === 'mdc.showOutput');
      assert.ok(showOutputCmd, 'Extension should contribute mdc.showOutput command');
      
      const refreshMetadataCmd = commands.find((cmd: any) => cmd.command === 'mdc.refreshMetadata');
      assert.ok(refreshMetadataCmd, 'Extension should contribute mdc.refreshMetadata command');
    });
  });

  suite('Configuration', () => {
    test('Extension should contribute configuration properties', () => {
      const packageJSON = extension?.packageJSON;
      const configProperties = packageJSON?.contributes?.configuration?.properties || {};
      
      assert.ok(configProperties['mdc.enableFormatting'], 'Should have mdc.enableFormatting config');
      assert.ok(configProperties['mdc.enableComponentMetadataCompletions'], 
        'Should have mdc.enableComponentMetadataCompletions config');
      assert.ok(configProperties['mdc.componentMetadataLocalFilePattern'], 
        'Should have mdc.componentMetadataLocalFilePattern config');
      assert.ok(configProperties['mdc.componentMetadataURL'], 
        'Should have mdc.componentMetadataURL config');
      assert.ok(configProperties['mdc.debug'], 
        'Should have mdc.debug config');
    });

    test('Configuration should have correct default values', () => {
      const config = vscode.workspace.getConfiguration('mdc');
      
      // Test default values
      assert.strictEqual(
        config.get('enableFormatting'), 
        false, 
        'enableFormatting should default to false'
      );
      assert.strictEqual(
        config.get('enableComponentMetadataCompletions'), 
        false, 
        'enableComponentMetadataCompletions should default to false'
      );
      assert.strictEqual(
        config.get('debug'), 
        false, 
        'debug should default to false'
      );
    });
  });

  suite('Providers and Features', () => {
    test('Folding provider should be registered for mdc files', async function() {
      this.timeout(5000);
      
      await activateMdcLanguage();
      
      // Create a simple MDC document with foldable content
      const content = '::container\nSome content\n::';
      const doc = await vscode.workspace.openTextDocument({ 
        language: 'mdc', 
        content 
      });
      
      // Execute folding range provider
      const foldingRanges = await vscode.commands.executeCommand<vscode.FoldingRange[]>(
        'vscode.executeFoldingRangeProvider',
        doc.uri
      );
      
      // The folding provider should return ranges
      assert.ok(foldingRanges !== undefined, 'Folding range provider should be registered');
    });
  });

  suite('Menus and Keybindings', () => {
    test('Extension should contribute menu items', () => {
      const packageJSON = extension?.packageJSON;
      const menus = packageJSON?.contributes?.menus || {};
      
      assert.ok(menus['editor/title'], 'Should contribute editor/title menu items');
      assert.ok(menus['explorer/context'], 'Should contribute explorer/context menu items');
      assert.ok(menus['commandPalette'], 'Should contribute commandPalette menu items');
    });

    test('Extension should contribute keybindings', () => {
      const packageJSON = extension?.packageJSON;
      const keybindings = packageJSON?.contributes?.keybindings || [];
      
      assert.ok(keybindings.length > 0, 'Extension should contribute keybindings');
      
      const previewKeybinding = keybindings.find((kb: any) => 
        kb.command === 'markdown.showPreview'
      );
      assert.ok(previewKeybinding, 'Should have preview keybinding');
      assert.ok(previewKeybinding.when.includes('editorLangId == mdc'), 
        'Preview keybinding should be scoped to mdc language');
    });
  });

  suite('Snippets', () => {
    test('Extension should contribute snippets', () => {
      const packageJSON = extension?.packageJSON;
      const snippets = packageJSON?.contributes?.snippets || [];
      
      assert.ok(snippets.length > 0, 'Extension should contribute snippets');
      
      const mdcSnippets = snippets.find((s: any) => s.language === 'mdc');
      assert.ok(mdcSnippets, 'Extension should contribute snippets for mdc language');
    });
  });
}); 