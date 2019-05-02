const id = axe.utils.escapeSelector(node.getAttribute('id'));
let labels = Array.from(document.querySelectorAll(`label[for="${id}"]`));
let parent = node.parentNode;

if (labels.length) {
	// filter out hidden labels because they're fine
	// except: fail first label if hidden because of VO
	labels = labels.filter(function(label, index) {
		if (
			(index === 0 && !axe.commons.dom.isVisible(label, true)) ||
			axe.commons.dom.isVisible(label, true)
		) {
			return label;
		}
	});
}

while (parent) {
	if (
		parent.nodeName.toUpperCase() === 'LABEL' &&
		labels.indexOf(parent) === -1
	) {
		labels.push(parent);
	}
	parent = parent.parentNode;
}

this.relatedNodes(labels);

if (labels.length > 1) {
	const labelledby = axe.commons.dom.idrefs(node, 'aria-labelledby');
	return !labels.every(function(label) {
		return (
			labelledby.includes(label) || label.getAttribute('aria-hidden') === 'true'
		);
	});
}

return labels.length > 1;
